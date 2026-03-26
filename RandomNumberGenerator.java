import java.util.Scanner;
import java.util.Random;

public class RandomNumberGenerator {

    private Random random;

    public RandomNumberGenerator() {
        this.random = new Random();
    }

    // Generate a random integer between min and max (inclusive)
    public int generateInt(int min, int max) {
        if (min > max) {
            throw new IllegalArgumentException("Min value cannot be greater than Max value!");
        }
        return random.nextInt((max - min) + 1) + min;
    }

    // Generate a random double between min and max
    public double generateDouble(double min, double max) {
        if (min > max) {
            throw new IllegalArgumentException("Min value cannot be greater than Max value!");
        }
        return min + (max - min) * random.nextDouble();
    }

    // Generate a random boolean
    public boolean generateBoolean() {
        return random.nextBoolean();
    }

    // Generate multiple random integers at once
    public int[] generateMultipleInts(int count, int min, int max) {
        int[] numbers = new int[count];
        for (int i = 0; i < count; i++) {
            numbers[i] = generateInt(min, max);
        }
        return numbers;
    }

    // Generate a random element from an array
    public int pickRandom(int[] array) {
        if (array.length == 0) {
            throw new IllegalArgumentException("Array cannot be empty!");
        }
        return array[random.nextInt(array.length)];
    }

    // Simulate a dice roll (1-6)
    public int rollDice() {
        return generateInt(1, 6);
    }

    // Generate a random password string of given length
    public String generatePassword(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
        StringBuilder password = new StringBuilder();
        for (int i = 0; i < length; i++) {
            password.append(chars.charAt(random.nextInt(chars.length())));
        }
        return password.toString();
    }

    public static void main(String[] args) {
        RandomNumberGenerator rng = new RandomNumberGenerator();
        Scanner scanner = new Scanner(System.in);

        System.out.println("=== Random Number Generator ===");
        System.out.println("1. Generate random integer in range");
        System.out.println("2. Generate random double in range");
        System.out.println("3. Generate random boolean");
        System.out.println("4. Generate multiple random integers");
        System.out.println("5. Roll a dice");
        System.out.println("6. Generate random password");

        try {
            System.out.print("\nEnter your choice (1-6): ");
            int choice = scanner.nextInt();

            switch (choice) {
                case 1:
                    System.out.print("Enter minimum value: ");
                    int min = scanner.nextInt();
                    System.out.print("Enter maximum value: ");
                    int max = scanner.nextInt();
                    System.out.println("Random integer: " + rng.generateInt(min, max));
                    break;

                case 2:
                    System.out.print("Enter minimum value: ");
                    double minD = scanner.nextDouble();
                    System.out.print("Enter maximum value: ");
                    double maxD = scanner.nextDouble();
                    System.out.printf("Random double: %.4f%n", rng.generateDouble(minD, maxD));
                    break;

                case 3:
                    System.out.println("Random boolean: " + rng.generateBoolean());
                    break;

                case 4:
                    System.out.print("How many numbers to generate: ");
                    int count = scanner.nextInt();
                    System.out.print("Enter minimum value: ");
                    int minM = scanner.nextInt();
                    System.out.print("Enter maximum value: ");
                    int maxM = scanner.nextInt();
                    int[] numbers = rng.generateMultipleInts(count, minM, maxM);
                    System.out.print("Generated numbers: ");
                    for (int num : numbers) {
                        System.out.print(num + " ");
                    }
                    System.out.println();
                    break;

                case 5:
                    System.out.println("Dice roll result: " + rng.rollDice());
                    break;

                case 6:
                    System.out.print("Enter password length: ");
                    int length = scanner.nextInt();
                    System.out.println("Generated password: " + rng.generatePassword(length));
                    break;

                default:
                    System.out.println("Error: Invalid choice.");
                    return;
            }

        } catch (IllegalArgumentException e) {
            System.out.println("Error: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Error: Invalid input.");
        } finally {
            scanner.close();
        }
    }
}
