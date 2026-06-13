export interface RoomFilters {
  cursor?: string;
  limit?: number;
  search?: string;
  status?: string;
  language?: string;
}

export interface cursorFilters {
  cursor?: string;
  limit?: number;
}

export interface FilterRoomDocs {
  name: string;
  status: string;
  language: string;
}
