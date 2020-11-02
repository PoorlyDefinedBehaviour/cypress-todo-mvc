describe("List items", () => {
  beforeEach(() => {
    cy.seedAndVisit();
  });

  it("properly displays completed items", () => {
    cy.get(".todo-list li")
      .filter(".completed")
      .should("have.length", 1)
      .and("contain", "Eggs")
      .find(".toggle")
      .should("be.checked");
  });

  it("shows remaining todo count in the footer", () => {
    cy.get(".todo-count").should("contain", 3);
  });

  it("removes a todo", () => {
    cy.route({
      url: "/api/todos/1",
      method: "DELETE",
      status: 204,
      response: {},
    });

    cy.get(".todo-list li").first().find(".destroy").invoke("show").click();

    cy.get(".todo-list li")
      .should("have.length", 3)
      .should("not.contain", "Milk");
  });

  it("marks and incomplete item complete", () => {
    cy.fixture("todos").then(([todo]) => {
      cy.route("PUT", `/api/todos/${todo.id}`, { ...todo, isComplete: true });

      cy.get(".todo-list li")
        .first()
        .find(".toggle")
        .click()
        .should("be.checked");

      cy.get(".todo-list li").should("have.class", "completed");

      cy.get(".todo-count").should("contain", 2);
    });
  });
});
