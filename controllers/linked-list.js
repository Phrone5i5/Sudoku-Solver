class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
        this.prev = null;
    }
}

class LinkedList {
    constructor(headvalue) {
        if (!headvalue) {
            return console.log('Must provide an initial value for the first node');
        } else {
            this._head = new Node(headvalue);
            this._tail = this.head;
        }
    }

    insertAfter(node, value) {
        let newNode = new Node(value);
        let oldNext = node.next;

        newNode.next = oldNext;
        newNode.prev = node;
        node.next = newNode;
        // is strict equality required?
        if (this._tail == node) {
            this._tail = newNode;
        }
    }

    insertHead(value) {
        let newHead = new Node(value);
        let oldHead = this._head;
        newHead.next = oldHead;
        oldHead.prev = newHead;
        this._head = newHead;
        this._head.prev = this._tail;
        return this._head;
    }

    appendToTail(value) {
        let newTail = new Node(value);
        newTail.prev = this._tail;
        this._tail.next = newTail;
        this._tail = newTail;
        this._tail.next = this._head;
        return this._tail;
    }

    removeAfter(node) {
        let removedNode = node.next;
        if (!removedNode) {
            return console.log('Nothing to remove.');
        } else {
            let newNext = removedNode.next;
            node.next = newNext;
            newNext.prev = node;
            removedNode.next = null;
            removedNode.prev = null;
            if (this._tail == removedNode) {
                this._tail = node;
            }
        }
        return removedNode;
    }

    removeHead() {
        let oldHead = this._head;
        let newHead = this._head.next;
        this._head = newHead;
        this._head.prev = this._tail;
        oldHead.next = null;
        oldHead.prev = null;
        return this._head;
    }

    findNode(value) {
        let node = this._head;
        while (node) {
            if (node.value == value) {
                return node;
            }
            node = node.next;
        }
        return `No node with ${value} found.`;
    }

    forEach(callback) {
        let node = this._head;
        while(node) {
            callback(node.value);
            node = node.next;
        }
    }

    print() {
        let result = [];
        this.forEach((value) => {
            result.push(value);
        });
        return results.join(', ');
    }
}