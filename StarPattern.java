import java.util.Scanner;

public class StarPattern {

    // 1. Right-Angled Triangle
    public void rightAngledTriangle(int rows) {
        for (int i = 1; i <= rows; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print("* ");
            }
            System.out.println();
        }
    }

    // 2. Inverted Right-Angled Triangle
    public void invertedRightAngledTriangle(int rows) {
        for (int i = rows; i >= 1; i--) {
            for (int j = 1; j <= i; j++) {
                System.out.print("* ");
            }
            System.out.println();
        }
    }

    // 3. Pyramid (Centered)
    public void pyramid(int rows) {
        for (int i = 1; i <= rows; i++) {
            for (int j = 1; j <= rows - i; j++) {
                System.out.print(" ");
            }
            for (int j = 1; j <= (2 * i - 1); j++) {
                System.out.print("*");
            }
            System.out.println();
        }
    }

    // 4. Inverted Pyramid (Centered)
    public void invertedPyramid(int rows) {
        for (int i = rows; i >= 1; i--) {
            for (int j = 1; j <= rows - i; j++) {
                System.out.print(" ");
            }
            for (int j = 1; j <= (2 * i - 1); j++) {
                System.out.print("*");
            }
            System.out.println();
        }
    }

    // 5. Diamond
    public void diamond(int rows) {
        // Upper half
        for (int i = 1; i <= rows; i++) {
            for (int j = 1; j <= rows - i; j++) {
                System.out.print(" ");
            }
            for (int j = 1; j <= (2 * i - 1); j++) {
                System.out.print("*");
            }
            System.out.println();
        }
        // Lower half
        for (int i = rows - 1; i >= 1; i--) {
            for (int j = 1; j <= rows - i; j++) {
                System.out.print(" ");
            }
            for (int j = 1; j <= (2 * i - 1); j++) {
                System.out.print("*");
            }
            System.out.println();
        }
    }

    // 6. Right-Angled Triangle (Mirrored)
    public void mirroredRightAngledTriangle(int rows) {
        for (int i = 1; i <= rows; i++) {
            for (int j = 1; j <= rows - i; j++) {
                System.out.print(" ");
            }
            for (int j = 1; j <= i; j++) {
                System.out.print("*");
            }
            System.out.println();
        }
    }

    // 7. Hollow Square
    public void hollowSquare(int rows) {
        for (int i = 1; i <= rows; i++) {
            for (int j = 1; j <= rows; j++) {
                if (i == 1 || i == rows || j == 1 || j == rows) {
                    System.out.print("* ");
                } else {
                    System.out.print("  ");
                }
            }
            System.out.println();
        }
    }

    // 8. Hollow Pyramid
    public void hollowPyramid(int rows) {
        for (int i = 1; i <= rows; i++) {
            for (int j = 1; j <= rows - i; j++) {
                System.out.print(" ");
            }
            for (int j = 1; j <= (2 * i - 1); j++) {
                if (j == 1 || j == (2 * i - 1) || i == rows) {
                    System.out.print("*");
                } else {
                    System.out.print(" ");
                }
            }
            System.out.println();
        }
    }

    public static void main(String[] args) {
        StarPattern pattern = new StarPattern();
        Scanner scanner = new Scanner(System.in);
        System.out.println("=== Star Pattern Program ===");
        System.out.println("1. Right-Angled Triangle");
        System.out.println("2. Inverted Right-Angled Triangle");
        System.out.println("3. Pyramid");
        System.out.println("4. Inverted Pyramid");
        System.out.println("5. Diamond");
        System.out.println("6. Mirrored Right-Angled Triangle");
        System.out.println("7. Hollow Square");
        System.out.println("8. Hollow Pyramid");
        try {
            System.out.print("\nEnter your choice (1-8): ");
            int choice = scanner.nextInt();
            System.out.print("Enter the number of rows: ");
            int rows = scanner.nextInt();
            if (rows <= 0) {
                System.out.println("Error: Number of rows must be positive.");
                return;
            }
            System.out.println();
            switch (choice) {
                case 1: pattern.rightAngledTriangle(rows); break;
                case 2: pattern.invertedRightAngledTriangle(rows); break;
                case 3: pattern.pyramid(rows); break;
                case 4: pattern.invertedPyramid(rows); break;
                case 5: pattern.diamond(rows); break;
                case 6: pattern.mirroredRightAngledTriangle(rows); break;
                case 7: pattern.hollowSquare(rows); break;
                case 8: pattern.hollowPyramid(rows); break;
                default: System.out.println("Error: Invalid choice."); return;
            }
        } catch (Exception e) {
            System.out.println("Error: Invalid input.");
        } finally {
            scanner.close();
        }
    }
}
