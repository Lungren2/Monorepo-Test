/* =============================================================================
 * CONTEXT: application/common
 * PATTERN: result-type
 * DEPENDS_ON: None (standalone)
 * USED_BY: Application.Services.*, Endpoints.*
 * -----------------------------------------------------------------------------
 * Result<T> pattern for explicit success/failure. Avoids exceptions for expected
 * business failures. Aligns with TypeScript Result<T, E> frontend pattern.
 * =============================================================================
 */

namespace api.Application.Common;

/// <summary>
/// Represents the result of an operation that can succeed or fail.
/// </summary>
/// <typeparam name="T">The type of the success value</typeparam>
public readonly record struct Result<T>
{
    /// <summary>
    /// Gets a value indicating whether the operation succeeded.
    /// </summary>
    public bool Success { get; init; }

    /// <summary>
    /// Gets the success value if the operation succeeded, otherwise null.
    /// </summary>
    public T? Data { get; init; }

    /// <summary>
    /// Gets the error message if the operation failed, otherwise null.
    /// </summary>
    public string? Error { get; init; }

    /// <summary>
    /// Creates a successful result with the given data.
    /// </summary>
    public static Result<T> Ok(T data) => new() { Success = true, Data = data };

    /// <summary>
    /// Creates a failed result with the given error message.
    /// </summary>
    public static Result<T> Fail(string error) => new() { Success = false, Error = error };
}


