//
//  SalarySettingsView.swift
//  ShiftCalendar
//
//  Created by Lukas Berntsen on 09/12/2025.
//

import SwiftUI

struct SalarySettingsView : View {
    @Binding var hourlyWage: Double
    @Binding var taxPercentage: Double
    
    var body: some View {
        Form {
            Section(header: Text("Lønn")) {
                HStack {
                    Text("Timelønn:")
                    Spacer()
                    TextField("kr/t", value: $hourlyWage, format: .number)
                        .keyboardType(.decimalPad)
                }
            }
            
            Section(header: Text("Skatt")) {
                HStack {
                    Text("Skatteprosent:")
                    Spacer()
                    TextField("%", value: $taxPercentage, format: .percent)
                        .keyboardType(.decimalPad)
                }
            }
        }
    }
}

#Preview {
    @Previewable @State var wage = 50.0
    @Previewable @State var tax = 0.4
    
    SalarySettingsView(hourlyWage: $wage, taxPercentage: $tax)
}
