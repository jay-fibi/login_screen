import java.util.Scanner;

public class Calculator {
    
    // Addition
    public double add(double a, double b) {
        return a + b;
    }
    
    // Subtraction
    public double subtract(double a, double b) {
        return a - b;
    }
    
    // Multiplication
    public double multiply(double a, double b) {
        return a * b;
    }
    
    // Division
    public double divide(double a, double b) {
        if (b == 0) {
            throw new ArithmeticException("Cannot divide by zero!");
        }
        return a / b;
    }
    
    public static void main(String[] args) {
        Calculator calc = new Calculator();
        Scanner scanner = new Scanner(System.in);
        
        System.out.println("=== Simple Calculator ===");
        
        try {
            System.out.print("Enter first number: ");
            double num1 = scanner.nextDouble();
            
            System.out.print("Enter an operator (+, -, *, /): ");
            char operator = scanner.next().charAt(0);
            
            System.out.print("Enter second number: ");
            double num2 = scanner.nextDouble();
            
            double result;
            
            switch (operator) {
                case '+':
                    result = calc.add(num1, num2);
                    break;
                case '-':
                    result = calc.subtract(num1, num2);
                    break;
                case '*':
                    result = calc.multiply(num1, num2);
                    break;
                case '/':
                    result = calc.divide(num1, num2);
                    break;
                default:
                    System.out.println("Error: Invalid operator.");
                    return;
            }
            
            System.out.printf("Result: %.2f %c %.2f = %.2f%n", num1, operator, num2, result);
            
        } catch (ArithmeticException e) {
            System.out.println("Error: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Error: Invalid input.");
        } finally {
            scanner.close();
        }
    }
}
