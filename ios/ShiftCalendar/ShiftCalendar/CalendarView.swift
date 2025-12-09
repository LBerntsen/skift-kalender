//
//  CalendarView.swift
//  ShiftCalendar
//
//  Created by Lukas Berntsen on 08/12/2025.
//

import SwiftUI

struct CalendarView : View {
    private let daysOfWeek: [String] = {
        var calendar = Calendar.current
        calendar.locale = Locale.init(identifier: "no_NO")
        let symbols = calendar.shortWeekdaySymbols
        return Array(symbols[1...] + [symbols[0]])
    }()
    
    @State private var calendarGrid: [[Int?]] = [] // 2D array where each row is a week
    @State private var currentDate = Date()
    
    @State private var selectedNumber = -1
    @State private var showEditor = false
    @State private var tempShift = Shift.default
    
    @State private var shifts: [String: [Int: Shift]] = [:]
    
    var body: some View {
        VStack(spacing: 10) {
            Text(currentDate.formatted(.dateTime.month(.wide).locale(Locale.init(identifier: "no_NO"))))
                .frame(maxWidth: .infinity, alignment: .leading)
            
            // Weekday header
            HStack {
                ForEach(daysOfWeek, id: \.self) { day in
                    Text(day)
                        .frame(maxWidth: .infinity)
                        .font(.headline)
                }
            }
            
            // Calendar rows
            ForEach(calendarGrid.indices, id: \.self) { row in
                HStack {
                    ForEach(calendarGrid[row].indices, id: \.self) { col in
                        let day = calendarGrid[row][col]
                        
                        if let realDay = day {
                            let shift = getShift(day: realDay)
                            
                            CalendarCellView(day: realDay, isSelected: selectedNumber == day, shift: shift, onTap: {
                                selectedNumber = realDay
                                showEditor = true
                                
                                tempShift = shift ?? Shift.default
                            })
                        } else {
                            Text("")
                                .frame(maxWidth: .infinity, minHeight: 60)
                        }
                    }
                }
            }
        }
        .onAppear {
            calendarGrid = generateCalendarGrid(for: currentDate)
        }
        .frame(maxHeight: .infinity, alignment: .top)
        .padding()
        .gesture(
            DragGesture()
                .onEnded { value in
                    if value.translation.width < -50 {
                        currentDate = Calendar.current.date(byAdding: .month, value: 1, to: currentDate)!
                        calendarGrid = generateCalendarGrid(for: currentDate)
                    } else if value.translation.width > 50 {
                        currentDate = Calendar.current.date(byAdding: .month, value: -1, to: currentDate)!
                        calendarGrid = generateCalendarGrid(for: currentDate)
                    }
                }
        )
        .sheet(isPresented: $showEditor, onDismiss: closeAndResetEditor) {
            NavigationStack {
                ShiftEditorView(shift: $tempShift)
                    .navigationTitle("Endre vakt")
                    .navigationBarTitleDisplayMode(.inline)
                    .toolbar {
                        ToolbarItem(placement: .bottomBar) {
                            Button("Lagre endringer") {
                                if(getDurationBetweenTimeIntervals(startTime: tempShift.shiftInterval.startTime, endTime: tempShift.shiftInterval.endTime).minutesSinceMidnight > 0) {
                                    if(shifts[getMonthKey()] == nil) {
                                        shifts[getMonthKey()] = [:]
                                    }
                                    
                                    shifts[getMonthKey()]![selectedNumber] = tempShift
                                    tempShift = Shift.default
                                }
                                
                                showEditor = false
                                selectedNumber = -1
                            }
                            .disabled(!tempShift.isValid)
                        }
                    }
            }
        }
    }
    
    private func generateCalendarGrid(for date: Date) -> [[Int?]] {
        let calendar = Calendar.current
        let components = calendar.dateComponents([.year, .month], from: date)
        let startOfMonth = calendar.date(from: components)!
        
        let range = calendar.range(of: .day, in: .month, for: date)!
        let daysCount = range.count
        
        // First weekday
        let firstWeekDay = (calendar.component(.weekday, from: startOfMonth) + 5) % 7
        
        var cells: [Int?] = Array(repeating: nil, count: firstWeekDay)
        cells += (1...daysCount).map{ Optional($0) }
        
        while cells.count % 7 != 0 { cells.append(nil) }
        
        return stride(from: 0, to: cells.count, by: 7).map { Array(cells[$0..<$0+7]) }
    }
    
    private func getMonthKey() -> String
    {
        let calendar = Calendar.current
        let components = calendar.dateComponents([.year, .month], from: currentDate)
        
        let month = components.month ?? -1
        let year = components.year ?? -1
        
        return "\(month)\(year)"
    }
    
    private func getShift(day: Int) -> Shift? {
        return shifts[getMonthKey()]?[day]
    }
    
    private func closeAndResetEditor() {
        showEditor = false
        selectedNumber = -1
        tempShift = Shift.default
    }
}

struct CalendarCellView : View {
    let day: Int
    let isSelected: Bool
    let shift: Shift?
    let onTap: () -> Void
    
    var body: some View {
        VStack {
            Text(day.formatted())
            if let s = shift {
                Text("\(s.shiftInterval.startTime.formatted(.dateTime.hour().minute())) - \(s.shiftInterval.endTime.formatted(.dateTime.hour().minute()))")
                    .font(.caption2)
            }
        }
        .frame(maxWidth: .infinity, minHeight: 60)
        .background(isSelected ? Color.blue : Color.blue.opacity(0.2))
        .cornerRadius(8)
        .onTapGesture(perform: onTap)
    }
}

#Preview {
    CalendarView()
}
