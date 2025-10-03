/* =============================================================================
 * CONTEXT: domain/common
 * PATTERN: entity-interface
 * DEPENDS_ON: None (base interface)
 * USED_BY: Domain.Entities.*, Domain.Common.AuditableEntity
 * -----------------------------------------------------------------------------
 * Marker interface for entities with identity. TId allows flexible ID types
 * (int, long, Guid, string). All domain entities should implement this.
 * =============================================================================
 */

namespace api.Domain.Common;

/// <summary>
/// Marker interface for entities with an identity.
/// </summary>
/// <typeparam name="TId">The type of the entity's identifier</typeparam>
public interface IEntity<out TId>
{
    /// <summary>
    /// Gets the unique identifier for this entity.
    /// </summary>
    TId Id { get; }
}


