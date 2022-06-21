import { Response } from 'node-fetch';

export interface RandomFilterOptions {
	/** The maximum Length in characters */
	maxLength: number;
	/** The minimum Length in characters */
	minLength: number;
	/** Get a random quote with specific tag(s). This takes a list of one or more tag names, separated by a comma (meaning AND) or a pipe (meaning OR). A comma separated list will match quotes that have all of the given tags. While a pipe (|) separated list will match quotes that have any one of the provided tags./ */
	tags: string;
	/** Author Name or Author slug*/
	author: string;
}

export interface QuoteResponse {
	_id: string;
	/** The quotation text */
	content: string;
	/** The full name of the author */
	author: string;
	/** The `slug` of the quote author */
	authorSlug: string;
	/** The length of quote (number of characters) */
	length: number;
	/** An array of tag names for this quote */
	tags: string[];
}

/** if any Error Occurs */
export interface ErrorResponse {
	statusCode: number;
	statusMessage: string;
}

type QuoteRoutes = 'random' | 'quotes' | 'search' | 'author' | 'tags';
