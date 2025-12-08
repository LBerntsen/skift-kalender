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
                        
                        CalendarCellView(day: day, isSelected: selectedNumber == day, onTap: {
                            if let realDay = day {
                                selectedNumber = realDay
                            }
                        })
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
                        selectedNumber = -1
                    } else if value.translation.width > 50 {
                        currentDate = Calendar.current.date(byAdding: .month, value: -1, to: currentDate)!
                        calendarGrid = generateCalendarGrid(for: currentDate)
                        selectedNumber = -1
                    }
                }
        )
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
}

struct CalendarCellView : View {
    let day: Int?
    let isSelected: Bool
    let onTap: () -> Void
    
    var body: some View {
        if let realDay = day {
            Text(realDay.formatted())
                .frame(maxWidth: .infinity, minHeight: 60)
                .background(isSelected ? Color.blue : Color.blue.opacity(0.2))
                .cornerRadius(8)
                .onTapGesture(perform: onTap)
        } else {
            Text("")
                .frame(maxWidth: .infinity, minHeight: 60)
        }
    }
}

#Preview {
    CalendarView()
}
