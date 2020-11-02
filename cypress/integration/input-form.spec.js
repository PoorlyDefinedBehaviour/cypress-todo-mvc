describe("Input form", () => {
  beforeEach(() => cy.seedAndVisit([]));

  it("focuses input on load", () => {
    cy.focused().should("have.class", "new-todo");
  });

  it("acceps input", () => {
    const todoText = "Buy Milk";

    cy.get(".new-todo").type(todoText).should("have.value", todoText);
  });

  context("Form submission", () => {
    beforeEach(() => cy.server());

    it("Adds a new todo on submit", () => {
      const todoText = "Buy eggs";

      cy.route("POST", "/api/todos", {
        name: todoText,
        id: 1,
        isComplete: false,
      });

      cy.get(".new-todo")
        .type(todoText)
        .type("{enter}")
        .should("have.value", "");

      cy.get(".todo-list li").should("have.length", 1).and("contain", todoText);
    });

    it("Shows an error message on a failed submission", () => {
      cy.route({
        url: "/api/todos",
        method: "POST",
        status: 500,
        response: {},
      });

      cy.get(".new-todo").type("test{enter}");

      cy.get(".todo-list li").should("not.exist");

      cy.get(".error").should("be.visible");
    });
  });
});
