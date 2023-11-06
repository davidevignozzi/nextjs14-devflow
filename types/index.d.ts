export interface SidebarLink {
  imgURL: string;
  route: string;
  label: string;
}

export interface URLProps {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
}
