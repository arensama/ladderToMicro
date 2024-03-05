# Ladder Diagram Application

## Overview
This application is built using ReactJS and ElectronJS to create ladder diagrams and generate C++ logical code for use in normal C applications implementing the logic provided by the diagram. Additionally, the application can generate C++ code optimized for microcontrollers, specifically targeting the STM32F103C8T6 microcontroller. With minor modifications, the generated code can be adapted for other microcontrollers as well.

## Features
- **Ladder Diagram Creation**: Create ladder diagrams using an intuitive graphical interface.
- **C++ Logical Code Generation**: Automatically generate C++ logical code based on the ladder diagram.
- **Microcontroller Optimization**: Generate optimized C++ code for the STM32F103C8T6 microcontroller.
- **Debug Mode**: Monitor microcontroller pins states and display them on the ladder diagram during debug mode.
- **Flexibility**: Code can be easily modified for other microcontrollers with minimal changes.

## Usage
1. **Creating Ladder Diagrams**:
   - Launch the application and use the graphical interface to create your ladder diagram.
   - Connect input and output elements, and define logical operations as required.

2. **Generating C++ Logical Code**:
   - Once the ladder diagram is complete, use the application to generate C++ logical code.
   - The generated code can be used in normal C applications to implement the logic defined by the diagram.

3. **Generating Microcontroller Code**:
   - To generate optimized code for the STM32F103C8T6 microcontroller, select the appropriate option in the application.
   - Modify the generated code as necessary for your specific microcontroller if not targeting the STM32F103C8T6.

4. **Debug Mode**:
   - Select debug mode to monitor microcontroller pins states and display them on the ladder diagram for debugging purposes.

## Requirements
- **Operating System**: Windows, macOS, or Linux.
- **Development Environment**: ReactJS, ElectronJS, C++ compiler for generating and running C++ code.

## Installation
1. Clone the repository.
2. Install dependencies using `npm install`.
3. Ensure you have the following tools installed:
   - `arm-none-eabi-gdb`: GNU debugger for ARM Cortex-M microcontrollers.
   - `st-util`: Command-line utility for interfacing with STMicroelectronics STM32 microcontrollers.

## Usage
- To run the application in developer mode, use `npm run start`.
- To build the standalone application, use `npm run build`.

## Acknowledgements
- **Author**: Amirreza Namazi Bayegi
- **Supervisor**: Dr. Hamid Noori, Ferdowsi University of Mashhad

## Contact
- **Email**: amirrezanamazibayegi@gmail.com
