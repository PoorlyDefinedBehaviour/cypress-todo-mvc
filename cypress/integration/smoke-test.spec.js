describe("Smoke tests", () => {
  beforeEach(() =>
    cy
      .request("GET", "/api/todos")
      .its("body")
      .each((todo) => cy.request("DELETE", `/api/todos/${todo.id}`))
  );

  context("with no todos", () => {
    it("saves new todos", () => {
      const testCases = [
        { text: "Buy milk", expectedTodoListLength: 1 },
        { text: "Buy eggs", expectedTodoListLength: 2 },
        { text: "Buy bread", expectedTodoListLength: 3 },
      ];

      cy.visit("/");

      cy.server();

      cy.route("POST", "/api/todos").as("create");

      cy.wrap(testCases).each(({ text, expectedTodoListLength }) => {
        cy.focused().type(text).type("{enter}");

        cy.wait("@create");

        cy.get(".todo-list li").should("have.length", expectedTodoListLength);
      });
    });
  });

  context("with active todos", () => {
    beforeEach(() => {
      cy.fixture("todos").each((todo) =>
        cy.request("POST", "/api/todos", { ...todo, isComplete: false })
      );

      cy.visit("/");
    });

    it("fetches existing todos", () => {
      cy.get(".todo-list li").should("have.length", 4);
    });

    it("deletes todos", () => {
      cy.server();

      cy.route("DELETE", "/api/todos/*").as("delete");

      cy.get(".todo-list li")
        .each((element) => {
          cy.wrap(element).find(".destroy").invoke("show").click();

          cy.wait("@delete");
        })
        .should("not.exist");
    });

    it("toggles todos", () => {
      const clickAndWait = (element) => {
        cy.wrap(element).as("item").find(".toggle").click();

        cy.wait("@update");
      };
      cy.server();

      cy.route("PUT", "/api/todos/*").as("update");

      cy.get(".todo-list li")
        .each((element) => {
          clickAndWait(element);

          cy.get("@item").should("have.class", "completed");
        })
        .each((element) => {
          clickAndWait(element);

          cy.get("@item").should("not.have.class", "completed");
        });
    });
  });
});
