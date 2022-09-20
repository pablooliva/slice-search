export class Assert {
	public static assert(
		condition: boolean,
		message?: string,
	): asserts condition {
		if (!condition) {
			throw new Error(message ?? 'Assertion failed');
		}
	}
}
