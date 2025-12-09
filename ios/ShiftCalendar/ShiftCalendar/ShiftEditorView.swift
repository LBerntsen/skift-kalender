//
//  Untitled.swift
//  ShiftCalendar
//
//  Created by Lukas Berntsen on 09/12/2025.
//

import SwiftUI

struct ShiftEditorView : View {
    @Binding var shift: Shift
    
    var body: some View {
        Form {
            Section(header: Text("Vakt")) {
                DatePicker("Start tid", selection: $shift.shiftInterval.startTime, displayedComponents: .hourAndMinute)
                
                DatePicker("Slutt tid", selection: $shift.shiftInterval.endTime, displayedComponents: .hourAndMinute)
                
                HStack {
                    Text("Varighet")
                    Spacer()
                    Text(getDurationBetweenTimeIntervals(startTime: shift.shiftInterval.startTime, endTime: shift.shiftInterval.endTime).formatted(.dateTime.hour().minute()))
                }
            }
            
            Section(header: Text("Pause")) {
                DatePicker("Start tid", selection: $shift.breakInterval.startTime, displayedComponents: .hourAndMinute)
                
                DatePicker("Slutt tid", selection: $shift.breakInterval.endTime, displayedComponents: .hourAndMinute)
                
                HStack {
                    Text("Varighet")
                    Spacer()
                    Text(getDurationBetweenTimeIntervals(startTime: shift.breakInterval.startTime, endTime: shift.breakInterval.endTime).formatted(.dateTime.hour().minute()))
                }
            }
        }
    }
}

#Preview {
    @Previewable @State var shift = Shift(shiftInterval: TimeRange(startTime: Date.fromMinutesSinceMidnight(minutes: 30), endTime: Date.fromMinutesSinceMidnight(minutes: 234)), breakInterval: TimeRange(startTime: Date.fromMinutesSinceMidnight(minutes: 320), endTime: Date.fromMinutesSinceMidnight(minutes: 984)))
    ShiftEditorView(shift: $shift)
}
