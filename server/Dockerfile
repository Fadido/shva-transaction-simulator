# syntax=docker/dockerfile:1
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY Shva.Domain/Shva.Domain.csproj Shva.Domain/
COPY Shva.Application/Shva.Application.csproj Shva.Application/
COPY Shva.Infrastructure/Shva.Infrastructure.csproj Shva.Infrastructure/
COPY Shva.Api/Shva.Api.csproj Shva.Api/
RUN dotnet restore Shva.Api/Shva.Api.csproj

COPY Shva.Domain/ Shva.Domain/
COPY Shva.Application/ Shva.Application/
COPY Shva.Infrastructure/ Shva.Infrastructure/
COPY Shva.Api/ Shva.Api/
RUN dotnet publish Shva.Api/Shva.Api.csproj -c Release -o /out --no-restore /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /out ./
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "Shva.Api.dll"]
