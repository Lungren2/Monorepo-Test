/* =============================================================================
 * CONTEXT: infrastructure/data-access
 * PATTERN: repository-interface
 * DEPENDS_ON: None (generic interface)
 * USED_BY: Infrastructure.Data.BaseRepository, Infrastructure.Repositories.*
 * -----------------------------------------------------------------------------
 * Generic repository interface for basic CRUD. Projects extend with specific
 * queries. All methods support CancellationToken for async cancellation.
 * =============================================================================
 */

namespace api.Infrastructure.Data;

/// <summary>
/// Generic repository interface for basic CRUD operations.
/// </summary>
/// <typeparam name="TEntity">The entity type</typeparam>
/// <typeparam name="TId">The entity's identifier type</typeparam>
public interface IRepository<TEntity, in TId> where TEntity : class
{
    /// <summary>
    /// Retrieves an entity by its identifier.
    /// </summary>
    Task<TEntity?> GetByIdAsync(TId id, CancellationToken ct = default);

    /// <summary>
    /// Retrieves all entities.
    /// </summary>
    Task<IReadOnlyList<TEntity>> ListAsync(CancellationToken ct = default);

    /// <summary>
    /// Adds a new entity.
    /// </summary>
    Task<TEntity> AddAsync(TEntity entity, CancellationToken ct = default);

    /// <summary>
    /// Updates an existing entity.
    /// </summary>
    Task UpdateAsync(TEntity entity, CancellationToken ct = default);

    /// <summary>
    /// Deletes an entity by its identifier.
    /// </summary>
    Task DeleteAsync(TId id, CancellationToken ct = default);
}


