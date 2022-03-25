// function createNode(value, id) {
//   return {
//     id: id,
//     value: value,
//     nextID: null,
//     previousID: null,
//   };
// }

// class DoublyLinkedList {
//   constructor() {
//     this.head = null;
//     this.tail = null;
//     this.length = 0;
//     this.current = null;
//   }

//   insert(value) {
//     this.length++;
//     let newNode = createNode(value);

//     if (this.tail) {
//       this.tail.nextID = newNode.id;
//       newNode.previousID = this.tail.id;
//       this.tail = this.current = newNode;
//       return newNode;
//     }

//     this.head = this.tail = this.current = newNode;
//     return newNode;
//   }

//   getCurrent() {
//     if (this.current.value) return this.current.value;
//   }
//   prev() {
//     if (this.current.previous) this.current = this.current.previous;
//   }
//   next() {
//     if (this.current.next) this.current = this.current.next;
//   }
// }

// // Testing functions

// const dLinkedList = new DoublyLinkedList();
// module.exports = dLinkedList;
