public class BST<T extends Comparable<T>> {

    public BinaryNode<T> root;

    public BST() {
        root = null;
    }

    public void delete(T data) {
        if (root == null){
            return;
        } 
        if (root.data.compareTo(data) == 0){
            if ((root.left != null) && (root.right != null)){
                BinaryNode<T> rootOld = root;
                root = root.left;
                BinaryNode<T> max = findMax();
                rootOld.data = max.data;
                delete(max.data);
                rootOld.left = root;
                root = rootOld;
            } else if (root.right != null){
                root = root.right;
            } else if (root.left != null){
                root = root.left;
            } else {
                root = null;
            }
        } else if (root.data.compareTo(data) > 0){
            BinaryNode<T> rootOld = root;
            root = root.left;
            delete(data);
            rootOld.left = root;
            root = rootOld;
        } else {
            BinaryNode<T> rootOld = root;
            root = root.right;
            delete(data);
            rootOld.right = root;
            root = rootOld;
        }
    }

    public boolean contains(T data) {
        if (root.data.compareTo(data) == 0){
            return true;
        }
        if (root.data.compareTo(data) > 0){
            if (root.left == null){
                return false;
            }
            BinaryNode<T> rootOld = root;
            root = root.left;
            boolean ans = contains(data);
            root = rootOld;
            return ans;
        } else {
            if (root.right == null){
                return false;
            }
            BinaryNode<T> rootOld = root;
            root = root.right;
            boolean ans = contains(data);
            root = rootOld;
            return ans;
        }
    }

    public void insert(T data) {
        if (root == null){
            root = new BinaryNode<>(data);
        } 
        if (root.data.compareTo(data) == 0){
            return;
        }

        if (root.data.compareTo(data) <= 0){
            if (root.right == null){
                root.right = new BinaryNode<>(data);
            } else {
                BinaryNode<T> rootOld = root;
                root = root.right;
                insert(data);
                root = rootOld;
            }
        }

        if (root.data.compareTo(data) > 0){
            if (root.left == null){
                root.left = new BinaryNode<>(data);
            } else {
                BinaryNode<T> rootOld = root;
                root = root.left;
                insert(data);
                root = rootOld;
            }
        }
    }

    public int getHeight() {
        if (root == null){
            return 0;
        }
        if ((root.left == null) && (root.right == null)){
            return 1;
        }
        int heightLeft = 0;
        BinaryNode<T> rootL = root;
        root = root.left;
        heightLeft = getHeight();
        root = rootL;

        int heightRight = 0;
        BinaryNode<T> rootR = root;
        root = root.right;
        heightRight = getHeight();
        root = rootR;

        if (heightLeft >= heightRight){
            return heightLeft;
        } else {
            return heightRight;
        }
    }

    public String printSearchPath(T data) {
        String ans = "";
        if (root.data.compareTo(data) == 0){
            return data.toString();
        }
        if (root.data.compareTo(data) > 0){
            if (root.left == null){
                return "";
            }
            BinaryNode<T> rootOld = root;
            root = root.left;
            ans += " -> " + printSearchPath(data);
            root = rootOld;
            return ans;
        } else {
            if (root.right == null){
                return "Null";
            }
            BinaryNode<T> rootOld = root;
            root = root.right;
            ans += " -> " + printSearchPath(data);
            root = rootOld;
            return ans;
        }
    }

    public int getNumLeaves() {
        if (root == null){
            return 0;
        }
        int count = 0;
        if ((root.left == null)&&(root.right == null)){
            count += 1;
        } else {
            if (root.left == null){ 
                BinaryNode<T> Lefty = root;
                getNumLeaves();
                root = Lefty;
            } else {
                BinaryNode<T> Righty = root;
                getNumLeaves();
                root = Righty;
            }
        }
        return count;
    }

    public BST<T> extractBiggestSuperficiallyBalancedSubTree() {
        return null;
    }

    public BinaryNode<T> getNode(T data) {
        return null;
    }

    public boolean isSuperficiallyBalanced() {
        return false;
    }

    public BinaryNode<T> findMax() {
        if (root == null){
            return null;
        }

        if (root.right != null){
            BinaryNode<T> rootOld = root;
            root = root.right;
            BinaryNode<T> result = findMax();
            root = rootOld;
            return result;
        } 
        return root;
    }

    public BinaryNode<T> findMin() {
        if (root == null){
            return null;
        }

        if (root.left != null){
            BinaryNode<T> rootOld = root;
            root = root.left;
            BinaryNode<T> result = findMin();
            root = rootOld;
            return result;
        } 
        return root;
    }

    ///////////////

    private StringBuilder toString(BinaryNode<T> node, StringBuilder prefix, boolean isTail, StringBuilder sb) {
        if (node.right != null) {
            toString(node.right, new StringBuilder().append(prefix).append(isTail ? "│   " : "    "), false, sb);
        }
        sb.append(prefix).append(isTail ? "└── " : "┌── ").append(node.data.toString()).append("\n");
        if (node.left != null) {
            toString(node.left, new StringBuilder().append(prefix).append(isTail ? "    " : "│   "), true, sb);
        }
        return sb;
    }

    @Override
    public String toString() {
        return root == null ? "Empty tree" : toString(root, new StringBuilder(), true, new StringBuilder()).toString();
    }

}
