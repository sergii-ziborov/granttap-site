# Web approvals and questions

`ApprovalCard` renders all four providers through the same public approval
contract. Permission, single-choice, multiple-choice and free-form questions
share relay receipt semantics. A complete human answer is required before
sending a question answer. The card remains pending until native resolution;
relay storage is explicitly different from execution on a computer.

Tests: `tests/approval-ui.test.tsx`.
