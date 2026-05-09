using Microsoft.EntityFrameworkCore;
using Shva.Application;
using Shva.Application.Dtos;
using Shva.Domain;

namespace Shva.Infrastructure;

public class TransactionService : ITransactionService
{
    private readonly AppDbContext _db;

    public TransactionService(AppDbContext db) => _db = db;

    public async Task<TransactionResponseDto> SubmitAsync(string userId, TransactionRequestDto request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Region) || !Region.IsSupported(request.Region))
        {
            throw new ArgumentException($"Unsupported region: {request.Region}");
        }

        var (status, localTime) = BankingHoursPolicy.Evaluate(request.Region, request.SubmittedAtUtc);

        var entity = new Transaction
        {
            UserId = userId,
            Region = request.Region.ToUpperInvariant(),
            SubmittedAtUtc = DateTime.SpecifyKind(request.SubmittedAtUtc, DateTimeKind.Utc),
            LocalTime = localTime,
            Status = status,
            CreatedAtUtc = DateTime.UtcNow
        };

        _db.Transactions.Add(entity);
        await _db.SaveChangesAsync(ct);

        return entity.ToResponse();
    }

    public async Task<IReadOnlyList<TransactionResponseDto>> GetApprovedAsync(string userId, CancellationToken ct = default)
    {
        var rows = await _db.Transactions
            .AsNoTracking()
            .Where(t => t.UserId == userId && t.Status == TransactionStatus.Approved)
            .OrderByDescending(t => t.CreatedAtUtc)
            .ToListAsync(ct);

        return rows.Select(r => r.ToResponse()).ToList();
    }
}
