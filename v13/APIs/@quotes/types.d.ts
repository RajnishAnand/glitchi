import {Response} from "node-fetch";

export interface RandomFilterOptions {
  /** The maximum Length in characters */
  maxLength: number;
  /** The minimum Length in characters */
  minLength: number;
  /** Get a random quote with specific tag(s)) */
  tag: {
    /** if set true will match quotes that have all of the given tags.*/
    required : boolean;
    /** tags to match for*/
    tags : string[];
  }
  /** Author Name or Author slug*/
  author: string
}


export interface RandomResponse {
  _id: string
  /** The quotation text */
  content: string
  /** The full name of the author */
  author: string
  /** The `slug` of the quote author */
  authorSlug: string
  /** The length of quote (number of characters) */
  length: number
  /** An array of tag names for this quote */
  tags: string[]
}

type QuoteRoutes = "random"|"quote"|"search"|"author"|"tags";
