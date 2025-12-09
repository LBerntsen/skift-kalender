//
//  DateExtensions.swift
//  ShiftCalendar
//
//  Created by Lukas Berntsen on 09/12/2025.
//

import Foundation

extension Date {
    var minutesSinceMidnight: Int {
        let components = Calendar.current.dateComponents([.hour, .minute], from: self)
        return (components.hour ?? 0) * 60 + (components.minute ?? 0)
    }
    
    static func fromMinutesSinceMidnight(minutes: Int) -> Date {
        return Calendar.current.date(from: DateComponents(hour: minutes / 60, minute: minutes % 60)) ?? Date()
    }
}
