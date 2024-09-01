import { BookTable } from "../components/BookTable";

export function AllBooksPrivatePage() {
  return <BookTable isPrivate={false} />;
}
