/* =============================================================================
 * CONTEXT: domain/common
 * PATTERN: auditable-entity-base
 * DEPENDS_ON: Domain.Common.IEntity
 * USED_BY: Domain.Entities.* (project-specific entities)
 * -----------------------------------------------------------------------------
 * Base record for auditable entities with creation/update tracking. Immutable
 * via records, UTC timestamps. Inherit for entities needing audit trail.
 * =============================================================================
 */

namespace api.Domain.Common;

/// <summary>
/// Base record for auditable entities with creation and update tracking.
/// </summary>
/// <typeparam name="TId">The type of the entity's identifier</typeparam>
public abstract record AuditableEntity<TId> : IEntity<TId>
{
    /// <summary>
    /// Gets the unique identifier for this entity.
    /// </summary>
    public required TId Id { get; init; }

    /// <summary>
    /// Gets the UTC timestamp when this entity was created.
    /// </summary>
    public DateTime CreatedAt { get; init; } = DateTime.UtcNow;

    /// <summary>
    /// Gets the UTC timestamp when this entity was last updated.
    /// </summary>
    public DateTime UpdatedAt { get; init; } = DateTime.UtcNow;
}


