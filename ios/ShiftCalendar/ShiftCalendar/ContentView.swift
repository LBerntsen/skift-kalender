//
//  ContentView.swift
//  ShiftCalendar
//
//  Created by Lukas Berntsen on 08/12/2025.
//

import SwiftUI

struct ContentView: View {
    @State private var hourlyWage = 50.0
    @State private var taxPercentage = 0.4
    
    var body: some View {
        TabView {
            CalendarView(hourlyWage: $hourlyWage, taxPercentage: $taxPercentage)
                .tabItem {
                    Label("Kalender", systemImage: "calendar")
                }
            
            SalarySettingsView(hourlyWage: $hourlyWage, taxPercentage: $taxPercentage)
                .tabItem {
                    Label("Lønn", systemImage: "dollarsign.circle")
                }
        }

    }
}

#Preview {
    ContentView()
}
