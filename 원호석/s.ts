class A {
    constructor(
        public name: string,
    ) {
    }
}

class B {
    constructor(
        public name: string,
    ) {
    }

    get length(): number {
        return 1;
    }

    set length(length: number) {

    }
}

const b = new B("a");

b.name;
b.length
b.length = 1;

function a(a: A) {

}

