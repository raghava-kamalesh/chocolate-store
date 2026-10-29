import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AnnouncementBar } from "@/components/AnnouncementBar";

describe("AnnouncementBar", () => {
  it("announces free shipping and links to the shop", () => {
    render(<AnnouncementBar />);

    expect(screen.getByRole("region", { name: "Announcement" })).toHaveTextContent(
      /free shipping on orders over \$50/i
    );
    expect(screen.getByRole("link", { name: /shop the case/i })).toHaveAttribute("href", "/shop");
  });
});
