//
//  Types.swift
//  ShiftCalendar
//
//  Created by Lukas Berntsen on 09/12/2025.
//

import Foundation

struct TimeRange {
    var startTime: Date
    var endTime: Date
    
    var startTimeMinues: Int {
        return startTime.minutesSinceMidnight
    }
    
    var endTimeMinutes: Int {
        return endTime.minutesSinceMidnight
    }
    
    var duration: Int {
        return endTimeMinutes - startTimeMinues
    }
}

struct Shift {
    var shiftInterval: TimeRange
    var breakInterval: TimeRange
    
    static let `default` = Shift(shiftInterval: TimeRange(startTime: Date.fromMinutesSinceMidnight(minutes: 0), endTime: Date.fromMinutesSinceMidnight(minutes: 0)), breakInterval: TimeRange(startTime: Date.fromMinutesSinceMidnight(minutes: 0), endTime: Date.fromMinutesSinceMidnight(minutes: 0)))
    
    var isValid: Bool {
        // Check that start is before end
        guard shiftInterval.startTimeMinues < shiftInterval.endTimeMinutes else { return false }
        guard breakInterval.startTimeMinues <= breakInterval.endTimeMinutes else { return false }
        
        if (breakInterval.duration > 0)
        {
            // Check that the break is contained within the shift
            guard breakInterval.startTimeMinues >= shiftInterval.startTimeMinues && breakInterval.endTimeMinutes <= shiftInterval.endTimeMinutes else { return false }
        }
        
        return true
        
    }
}
