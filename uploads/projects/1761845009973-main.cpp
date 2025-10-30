#include <fstream>
#include <iostream>
#include <sstream>

using namespace std;

int*** myArr = NULL;
int** numCols = NULL;
int numRows = 0;

void clearArray() {
    if (numCols==NULL){
        return;
    }
    if (myArr==NULL)
        return;

    for (int i=0; i<numRows; i++){
        for (int j=0; j<*numCols[i]; j++){
            delete myArr[i][j];
        }
        delete[] myArr[i];
        delete[] numCols[i];
    }
    delete[] myArr;
    myArr = NULL;
    delete[] numCols;
    numCols = NULL;

    cout << "Deleted array with "<< numRows <<" rows" << endl;
    numRows = 0;
}

void populateFromFile(std::string fileName) {
    fstream file(fileName.c_str());
    string line;

    if (myArr != NULL)
        clearArray();
    
    while (getline(file,line)){
        numRows++;
    }

    file.clear();
    file.seekg(0);
            
    myArr = new int**[numRows];
    numCols = new int*[numRows];
    for (int j=0; j<numRows; j++){
        getline(file,line);
        int col = 0;
        if (line != ""){
            string row = line;
            col++;
            while (row.find(',')!= std::string::npos){
                col++;
                row.erase(0,row.find(',')+1);
            }
            numCols[j] = new int(col);
            myArr[j] = new int*[col];
        }
        else{
            numCols[j] = new int(0);
            myArr[j] = new int*[0];
        }

        for (int k=0; k<col; k++){
            int colArr;
            if ((line !="")&&(line.find(',')!= std::string::npos)){
                string column = line.substr(0,line.find(','));
                stringstream(column)>> colArr;
                myArr[j][k] = new int(colArr);
                line.erase(0,line.find(',')+1);
            }
            else if ((line !="")&&(line.find(',')== std::string::npos)){
                stringstream(line)>> colArr;
                myArr[j][k] = new int(colArr);
                line = "";
            }
        }
        
    }

    file.close();
    cout << "Created array from textfile with " << numRows << " rows" << endl;
    return ;   
}

void populateFromTerminal() {
    string line;
    numRows = 0;

    if (myArr != NULL)
        clearArray();

    getline(cin,line);
    stringstream(line)>> numRows;
    while (numRows<0){
        getline(cin,line);
        stringstream(line)>> numRows;
    }

    myArr = new int**[numRows];
    numCols = new int*[numRows];
    for (int j=0; j<numRows; j++){
        getline(cin,line);
        int col = 0;
        if (line != ""){
            string row = line;
            col++;
            while (row.find(',')!= std::string::npos){
                col++;
                row.erase(0,row.find(',')+1);
            }
            numCols[j] = new int(col);
            myArr[j] = new int*[col];
        }
        else{
            continue;
        }

        for (int k=0; k<col; k++){
            int colArr;
            if ((line !="")&&(line.find(',')!= std::string::npos)){
                string column = line.substr(0,line.find(','));
                stringstream(column)>> colArr;
                myArr[j][k] = new int(colArr);
                line.erase(0,line.find(',')+1);
            }
            else if ((line !="")&&(line.find(',')== std::string::npos)){
                stringstream(line)>> colArr;
                myArr[j][k] = new int(colArr);
                line = "";
            }
        }    
    }
    cout << "Created array from terminal with " << numRows<< " rows" << endl;
    return;
}

void printArr() {
    if (myArr == NULL){
        cout << "Array is empty" << endl;
        return;
    }

    for (int i=0; i<numRows; i++){
        if (*numCols[i]!=0){
            for (int j=0; j<*numCols[i]-1; j++){
                cout << *myArr[i][j] << ",";
            }
            cout << *myArr[i][*numCols[i]-1] << endl;
        }else{
            cout << endl;
        }
    }
}

void printArrStructure() {
    if (myArr==NULL){
        cout << "Array is empty" << endl;
        return;
    }
    cout << numRows << ":[";
    for (int i=0; i<numRows; i++){
        if (i==numRows-1)
            cout << *numCols[i]<< "]" << endl;
        else
            cout << *numCols[i] << ",";
    }
}

int main() {
    /*populateFromFile("input.txt");
    printArr();
    printArrStructure();
    clearArray();
    return 0;*/
    std::cout << "Reading :\n";
    populateFromTerminal ();
    std::cout << "Printing\n";
    printArr ();
    printArrStructure ();
    clearArray ();
    return 0;
}