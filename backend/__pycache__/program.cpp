// Author: Arif Khan
// Admission No.: 23SCSE1470115

#include <iostream>
using namespace std;

int main() {
    int marks;
    cout << "Enter the marks: ";
    cin >> marks;

    if (marks < 0 || marks > 100) {
        cout << "Invalid input." << endl;
    } else if (marks < 50) {
        cout << "Grade: Fail" << endl;
    } else if (marks < 60) {
        cout << "Grade: D" << endl;
    } else if (marks < 70) {
        cout << "Grade: C" << endl;
    } else if (marks < 80) {
        cout << "Grade: B" << endl;
    } else {
        cout << "Grade: A" << endl;
    }

    return 0;
}