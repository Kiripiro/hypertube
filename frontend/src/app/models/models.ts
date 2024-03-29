/* Chat */
export interface Block {
	id: number;
	author_id: number;
	blocked_user_id: number;
	isBlocked: boolean;
}

export interface User {
	id: number;
	username: string;
	firstName: string;
	lastName: string;
	picture_1: string;
	status: string;
	block: Block;
	notificationCount?: number;
}

export interface Message {
	id: number;
	author_id: number;
	recipient_id: number;
	message: string;
	date: Date;
}

export interface StatusData {
	userId: number;
	status: string;
}

/* Auth */
export interface RegisterResponseData {
	message: string;
	user: {
		id: number,
		username: string,
		email: string,
		firstName: string,
		lastName: string,
		email_checked: boolean,
	};
}

export interface LoginResponseData {
	message: string;
	user: {
		id: number,
		username: string,
		firstName: string,
		lastName: string,
		email_checked: boolean,
		avatar: string,
		loginApi: boolean,
		language: string
	};
}

export interface GetUserResponseData {
	message: string;
	user: {
		id: number,
		username: string,
		firstName: string,
		lastName: string,
		email_checked: boolean,
		avatar: string,
		loginApi: boolean,
		language: string,
	};
}

export interface loginGoogleResponseData {
	message: string;
	user: {
		id: number,
		username: string,
		firstName: string,
		lastName: string,
		email_checked: boolean,
		avatar: string,
		loginApi: boolean,
	};
}

export interface FilmDetails {
	id: number | null;
	title: string;
	director: string;
	writer: string;
	actors: string;
	genre: string;
	language: string;
	plot: string;
	awards: string;
	poster_path: string;
	release_date: string;
	imdb_id: string;
	imdb_rating: string;
	seen: boolean;
}

export interface Comment {
	id: number;
	author_id: number;
	author_username: string;
	text: string;
	imdb_id: number;
	parent_id: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface CompleteRegisterResponseData {
	message: string;
	user: {
		gender: string,
		sexual_preferences: string,
		biography: string,
		picture_1: string,
		picture_2: string,
		picture_3: string,
		picture_4: string,
		picture_5: string,
		tags: UserTags[]
	};
}

export interface UpdateLocationResponseData {
	message: string;
	user: {
		latitude: number,
		longitude: number,
		city: string
	};
}

export interface IpApiResponseData {
	status: string;
	lat: number;
	lon: number;
}

export interface LocationIQApiResponseData {
	address: {
		city: string;
		municipality: string;
	};
}

export interface EmailValidationResponseData {
	message: string;
	error: string;
}

export interface PasswordResetRequestResponseData {
	message: string;
	error: string;
}

export interface PasswordResetValidationResponseData {
	message: string;
	error: string;
}


/* Sockets */
export interface StatusData {
	userId: number;
	status: string;
}

/* Relations */
export interface CheckLikeResponseData {
	exist: boolean;
}

export interface CheckMatchResponseData {
	exist: boolean;
}

export interface CreateLikeResponseData {
	message: string;
	likeId: Number;
}

export interface DeleteLikeResponseData {
	message: string;
	deleted: boolean;
}

export interface CreateBlockResponseData {
	message: string;
	blockId: number;
	data: {
		author_id: number,
		recipient_id: number
	};
}

export interface DeleteBlockResponseData {
	message: string;
}

export interface CreateReportResponseData {
	message: string;
	blockId: number;
	data: {
		author_id: number,
		recipient_id: number
	};
}

export interface CreateBlockResponseData {
	message: string;
	blockId: number;
	data: {
		author_id: number,
		recipient_id: number
	};
}

export interface DeleteReportResponseData {
	message: string;
}

export interface CreateViewResponseData {
	message: string;
}

export interface GetAllProfileViewsResponseData {
	data: {
		author_id: number,
		authorUsername: string,
		authorFirstName: string,
		authorLastName: string,
		recipient_id: number
	}[];
}

export interface GetAllProfileLikesResponseData {
	data: {
		author_id: number,
		authorUsername: string,
		authorFirstName: string,
		authorLastName: string,
		recipient_id: number
	}[];
}

/* Home */
export interface UserSimplified {
	id: number,
	username: string,
	age: number,
	tags: UserTags[],
	latitude: number,
	longitude: number,
	fame_rating: number,
	firstName: string,
	lastName: string,
	city: string
}

export interface UserTags {
	owner_id: number,
	name: string
}

export interface GetInterestingUsersResponseData {
	users: UserSimplified[]
}

export interface GetFameRatingResponseData {
	fame_rating: number
}

export interface getMoviesParams {
	limit: number,
	page: number,
	query_term: string,
	genre: string,
	sort_by: string,
	order_by: string,
}

export interface GetCitiesResponseData {
	cities: string[]
}

export interface GetSearchResultResponseData {
	users: UserSimplified[]
}

/* Settings */
export interface UserSettings {
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirm_password: string;
	avatar: string;
	loginApi: boolean;
	language: string;
}

export interface UserSettingsUpdate {
	message: string
	user: {
		id: number,
		username: string,
		firstName: string,
		lastName: string,
		email_checked: boolean,
		avatar: string,
		loginApi: boolean,
	};
}

/* Tags */
export interface Tag {
	id: number;
	name: string;
	owner_id: number;
}

/* Profile */
export interface ElementListData {
	author_id: number,
	authorUsername: string,
	authorFirstName: string,
	authorLastName: string,
	recipient_id: number
}

/* Notifications */
export interface Notification {
	author_id?: number,
	type: string,
	strong?: string,
	message: string,
}

/* Movies */
export interface LoadingMovieResponse {
	data: {
		size: number,
		totalSize: number,
		downloadError: boolean,
		isMKV: boolean,
		isWebm: boolean
	}
}

export interface StopLoadingMovieResponse {
	message: string
}

export interface MovieFileSizeResponse {
	data: {
		size: number,
		duration: number
	}
}

export interface TorrentInfosResponse {

}

export interface MovieDetailsResponse {
	movie: {
		title: string,
		genre: string,
		imdb_id: number,
		imdb_rating: number,
		plot: string,
		director: string,
		writer: string,
		actors: string,
		language: string,
		awards: string,
		release_date: string,
		poster: string,
		runtime: string,
	}
}

export interface SubtitlesItemResponse {
	lang: string,
	filePath: string,
	error: string
}

export interface DownloadSubtitlesResponse {
	subtitles: SubtitlesItemResponse[]
}


export const languages = [
	{ value: 'en', viewValue: 'English' },
	{ value: 'fr', viewValue: 'Français' },
	{ value: 'es', viewValue: 'Español' },
	{ value: 'de', viewValue: 'Deutsch' },
	{ value: 'it', viewValue: 'Italiano' },
	{ value: 'pt', viewValue: 'Português' },
	{ value: 'ru', viewValue: 'Русский' },
	{ value: 'zh', viewValue: '中文' },
	{ value: 'ja', viewValue: '日本語' },
	{ value: 'ko', viewValue: '한국어' },
	{ value: 'ar', viewValue: 'العربية' },
	{ value: 'tr', viewValue: 'Türkçe' },
	{ value: 'pl', viewValue: 'Polski' },
	{ value: 'nl', viewValue: 'Nederlands' },
	{ value: 'sv', viewValue: 'Svenska' },
	{ value: 'da', viewValue: 'Dansk' },
	{ value: 'fi', viewValue: 'Suomi' },
	{ value: 'no', viewValue: 'Norsk' },
	{ value: 'el', viewValue: 'Ελληνικά' },
	{ value: 'cs', viewValue: 'Čeština' },
	{ value: 'hu', viewValue: 'Magyar' },
	{ value: 'th', viewValue: 'ภาษาไทย' },
	{ value: 'vi', viewValue: 'Tiếng Việt' },
];