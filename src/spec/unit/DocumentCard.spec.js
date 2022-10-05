import { render, screen, fireEvent } from "@testing-library/react";

import DocumentCard from "../../components/DocumentCard";

describe("<DocumentCard />", () => {
  const documentId = "633bda9ffc84a757cc40f06e";
  const handleClick = jest.fn();
  const textBody = "test body";
  const updatedAt = "2022-10-04T07:00:25.162Z".split("T", 1)[0];

  it("DocumentCard components should show correct text body and created date and handleClick should be called", () => {
    render(
      <DocumentCard
        documentId={documentId}
        handleClick={handleClick}
        textBody={textBody}
        updatedAt={updatedAt}
      />
    );

    expect(screen.getByText(textBody)).toBeInTheDocument();
    expect(screen.getByText("latest update : 2022-10-04")).toBeInTheDocument();

    const documentCard = screen.getByTestId("documentCard");

    fireEvent.click(documentCard);

    expect(handleClick).toHaveBeenCalled();
  });
});
