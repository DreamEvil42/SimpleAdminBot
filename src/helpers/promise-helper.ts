export const PromiseHelper = {
    isFulfilled<T>(input: PromiseSettledResult<T>): input is PromiseFulfilledResult<T> {
        return input.status === 'fulfilled';
    }
}