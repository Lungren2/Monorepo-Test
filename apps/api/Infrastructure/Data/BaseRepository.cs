/* =============================================================================
 * CONTEXT: infrastructure/data-access
 * PATTERN: repository-base
 * DEPENDS_ON: IRepository, Dapper, Npgsql, IConfiguration
 * USED_BY: Infrastructure.Repositories.* (project-specific repos)
 * -----------------------------------------------------------------------------
 * Base repository using Dapper+Npgsql. Connection-per-operation (pooling auto),
 * parameterized queries, CancellationToken. Override AddAsync/UpdateAsync in derived.
 * =============================================================================
 */

using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace api.Infrastructure.Data;

/// <summary>
/// Base repository implementation using Dapper and Npgsql.
/// </summary>
public abstract class BaseRepository<TEntity, TId> : IRepository<TEntity, TId>
    where TEntity : class
{
    private readonly string _connectionString;

    protected BaseRepository(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found");
    }

    /// <summary>
    /// Gets the table name for this repository.
    /// Override in derived classes.
    /// </summary>
    protected abstract string TableName { get; }

    /// <summary>
    /// Creates a new database connection.
    /// Connection should be disposed after use (use await using or using statement).
    /// </summary>
    protected IDbConnection CreateConnection() => new NpgsqlConnection(_connectionString);

    public virtual async Task<TEntity?> GetByIdAsync(TId id, CancellationToken ct = default)
    {
        const string sql = "SELECT * FROM {0} WHERE id = @Id";
        var query = string.Format(sql, TableName);

        using var conn = CreateConnection();
        return await conn.QuerySingleOrDefaultAsync<TEntity>(
            new CommandDefinition(query, new { Id = id }, cancellationToken: ct)
        );
    }

    public virtual async Task<IReadOnlyList<TEntity>> ListAsync(CancellationToken ct = default)
    {
        var sql = $"SELECT * FROM {TableName}";

        using var conn = CreateConnection();
        var result = await conn.QueryAsync<TEntity>(
            new CommandDefinition(sql, cancellationToken: ct)
        );
        return result.ToList();
    }

    public virtual Task<TEntity> AddAsync(TEntity entity, CancellationToken ct = default)
    {
        // Note: Derived classes should override with actual INSERT implementation
        // This is a placeholder that projects will customize
        throw new NotImplementedException(
            $"AddAsync must be implemented in derived repository for {TableName}"
        );
    }

    public virtual Task UpdateAsync(TEntity entity, CancellationToken ct = default)
    {
        // Note: Derived classes should override with actual UPDATE implementation
        // This is a placeholder that projects will customize
        throw new NotImplementedException(
            $"UpdateAsync must be implemented in derived repository for {TableName}"
        );
    }

    public virtual async Task DeleteAsync(TId id, CancellationToken ct = default)
    {
        var sql = $"DELETE FROM {TableName} WHERE id = @Id";

        using var conn = CreateConnection();
        await conn.ExecuteAsync(
            new CommandDefinition(sql, new { Id = id }, cancellationToken: ct)
        );
    }
}


