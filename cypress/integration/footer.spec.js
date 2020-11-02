describe("Footer", () => {
  context("with a single todo", () => {
    it("display singular todo count", () => {
      cy.seedAndVisit([{ id: 1, name: "Buy Milk", isComplete: false }]);

      cy.get(".todo-count").should("contain", "1 todo left");
    });
  });

  context("with multiple todos", () => {
    beforeEach(() => cy.seedAndVisit());

    it("displays plural todo count", () => {
      cy.get(".todo-count").should("contain", "3 todos left");
    });

    it("handlers filter links", () => {
      const filters = [
        { link: "Active", expectedTodoListLength: 3 },
        { link: "Completed", expectedTodoListLength: 1 },
        { link: "All", expectedTodoListLength: 4 },
      ];

      cy.wrap(filters).each(({ link, expectedTodoListLength }) => {
        cy.contains(link).click();

        cy.get(".todo-list li").should("have.length", expectedTodoListLength);
      });
    });
  });
});
