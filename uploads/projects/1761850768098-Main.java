public class Main {
    public static void main(String[] args) {
        // Instantiate the BST
        BST<Integer> bst = new BST<>();

        // Insert elements
        bst.insert(10);
        bst.insert(5);
        bst.insert(15);
        bst.insert(2);
        bst.insert(7);
        bst.insert(12);
        bst.insert(17);

        // Print the tree
        System.out.println("Tree:");
        System.out.println(bst.toString());

        // Search for an element
        int searchData = 12;
        if (bst.contains(searchData)) {
            System.out.println("Found: " + searchData);
        } else {
            System.out.println("Not found: " + searchData);
        }

        // Delete an element
        int deleteData = 15;
        bst.delete(deleteData);
        System.out.println("Deleted: " + deleteData);

        // Print the tree after deletion
        System.out.println("Tree after deletion:");
        System.out.println(bst.toString());

        // Get height of the tree
        int height = bst.getHeight();
        System.out.println("Height of the tree: " + height);

        // Get number of leaves
        int numLeaves = bst.getNumLeaves();
        System.out.println("Number of leaves: " + numLeaves);

        // Find max and min
        System.out.println("Max: " + bst.findMax().data);
        System.out.println("Min: " + bst.findMin().data);

        // Print search path
        int searchPathData = 7;
        System.out.println("Search path for " + searchPathData + ": " + bst.printSearchPath(searchPathData));
    } 
}
