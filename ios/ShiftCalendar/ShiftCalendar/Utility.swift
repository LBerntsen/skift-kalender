//
//  Utility.swift
//  ShiftCalendar
//
//  Created by Lukas Berntsen on 09/12/2025.
//

import Foundation

func getDurationBetweenTimeIntervals(startTime: Date, endTime: Date) -> Date {
    var duration = endTime.minutesSinceMidnight - startTime.minutesSinceMidnight
    
    if duration < 0 {
        duration = 0
    }
    
    return Date.fromMinutesSinceMidnight(minutes: duration)
}
