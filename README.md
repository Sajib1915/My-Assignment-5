# GitHub Issues Tracker

A simple GitHub Issues Tracker built with HTML, CSS, and Vanilla JavaScript. It fetches real issues from an API and lets you filter, search, and view details in a modal.

---

## Questions & Answers

### 1. What is the difference between var, let, and const?

When I first started writing JavaScript, I used `var` everywhere without thinking much about it. But later I realized `var` has some weird behaviors that can cause bugs.

`var` is the old way of declaring variables. The problem with `var` is that it is function-scoped, meaning it does not care about blocks like `if` or `for`. So if you declare a variable inside an `if` block using `var`, it is actually accessible outside that block too. This can lead to unexpected bugs.

```javascript
if (true) {
  var name = "Mohammad";
}
console.log(name); // "Mohammad" — still accessible, which is strange
```

`let` was introduced in ES6 to fix this problem. It is block-scoped, meaning the variable only lives inside the `{}` it was declared in. I used `let` in this project for things that change over time, like `currentFilter`.

```javascript
let currentFilter = 'all';
currentFilter = 'open'; // can be reassigned
```

`const` is also block-scoped like `let`, but you cannot reassign it after declaring. I used `const` for things that never change, like `API_BASE` and `ADMIN` credentials.

```javascript
const API_BASE = 'https://phi-lab-server.vercel.app/api/v1/lab';
// API_BASE = 'something else'; // This would throw an error
```

My simple rule: use `const` by default. Use `let` only when the value needs to change. Never use `var`.

---

### 2. What is the spread operator (...)?

The spread operator is three dots `...` and it basically "spreads out" the contents of an array or object into individual pieces.

I think of it like unpacking a bag. If you have a bag full of items and you want to put them on a table, the spread operator does that unpacking for you.

For arrays, it is really useful when you want to combine two arrays or copy one:

```javascript
const openIssues = ['bug fix', 'dark mode'];
const closedIssues = ['readme update'];

const allIssues = [...openIssues, ...closedIssues];
// ['bug fix', 'dark mode', 'readme update']
```

For objects, it works the same way. If I want to copy an issue and update just one property:

```javascript
const issue = { id: 1, status: 'open', title: 'Fix bug' };
const updatedIssue = { ...issue, status: 'closed' };
// { id: 1, status: 'closed', title: 'Fix bug' }
```

In this project I could use the spread operator when filtering or copying the issues array without modifying the original data.

---

### 3. What is the difference between map(), filter(), and forEach()?

These three are array methods and I used all of them in this project. They look similar but they do very different things.

`forEach()` simply loops through every item in an array and runs a function for each one. It does not return anything. I use it when I just want to do something with each item, like adding a class to buttons.

```javascript
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.classList.remove('active');
});
```

`filter()` loops through the array but keeps only the items that pass a condition. It always returns a new array with the matching items. I used this to show only open or closed issues.

```javascript
const openIssues = allIssues.filter(issue => issue.status === 'open');
```

`map()` loops through the array and transforms each item into something new. It always returns a new array of the same length. I used this to turn each issue object into an HTML string for the cards.

```javascript
const cardsHTML = issues.map(issue => createCardHTML(issue)).join('');
```

The key difference: `forEach` just runs code, `filter` picks items, `map` transforms items.

---

### 4. What is an arrow function?

An arrow function is a shorter way to write a function in JavaScript. It was introduced in ES6 and I used it everywhere in this project because it makes the code cleaner and easier to read.

The old way of writing a function:

```javascript
function getLabelClass(label) {
  return 'label-bug';
}
```

The arrow function way:

```javascript
const getLabelClass = (label) => {
  return 'label-bug';
}
```

If the function only has one line and returns something, you can make it even shorter:

```javascript
const double = (n) => n * 2;
```

Arrow functions are especially useful inside `map`, `filter`, and `forEach` because they keep the code on one line:

```javascript
const filtered = allIssues.filter(issue => issue.status === 'open');
```

One important thing: arrow functions do not have their own `this`. They inherit `this` from the surrounding code. This is actually helpful in many situations and is one reason arrow functions became so popular.

---

### 5. What are template literals?

Template literals are a better way to work with strings in JavaScript. Instead of using single or double quotes, you use backticks `` ` ``. The big advantage is that you can put variables or expressions directly inside the string using `${}` without any messy string joining.

The old way was annoying:

```javascript
const message = 'Issue #' + issue.id + ' by ' + issue.author;
```

With template literals it becomes much cleaner:

```javascript
const message = `Issue #${issue.id} by ${issue.author}`;
```

I used template literals heavily in this project when building the API URLs and the card HTML. For example:

```javascript
const res = await fetch(`${API_BASE}/issues/search?q=${encodeURIComponent(query)}`);
```

Template literals also support multi-line strings, which is why I could write the entire card HTML inside backticks across multiple lines without any special characters. That made the `createCardHTML` function much easier to read and maintain.
