import { render, screen, fireEvent } from "@testing-library/react";

import DocumentCard from "../../DocumentCard";

describe("<DocumentCard />", () => {
  const handleClick = jest.fn();
  const textBody = "test body";
  const createdAt = "2022-10-04T07:00:25.162Z";

  it("DocumentCard component should show correct text body and created date and handleClick should be called", () => {
    render(
      <DocumentCard
        handleClick={handleClick}
        textBody={textBody}
        createdAt={createdAt}
      />
    );

    expect(screen.getByText(textBody)).toBeInTheDocument();
    expect(screen.getByText(createdAt)).toBeInTheDocument();

    const documentCard = screen.getByTestId("documentCard");

    fireEvent.click(documentCard);

    expect(handleClick).toHaveBeenCalled();
  });
});
