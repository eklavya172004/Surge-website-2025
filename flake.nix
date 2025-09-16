{
  description = "Prisma development environment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  };

  outputs = {nixpkgs, ...}: let
    system = "x86_64-linux";
    pkgs = import nixpkgs {
      inherit system;
      config = {
        permittedInsecurePackages = ["openssl-1.1.1w"];
        allowUnfree = true;
      };
    };
  in {
    devShells.${system}.default = pkgs.mkShell {
      buildInputs = with pkgs; [
        nodejs
        prisma
        prisma-engines
        openssl_1_1
      ];

      shellHook = ''
        export PKG_CONFIG_PATH=${pkgs.openssl_1_1.dev}/lib/pkgconfig
        export PRISMA_SCHEMA_ENGINE_BINARY=${pkgs.prisma-engines}/bin/schema-engine
        export PRISMA_QUERY_ENGINE_BINARY=${pkgs.prisma-engines}/bin/query-engine
        export PRISMA_QUERY_ENGINE_LIBRARY=${pkgs.prisma-engines}/lib/libquery_engine.node
        export PRISMA_FMT_BINARY=${pkgs.prisma-engines}/bin/prisma-fmt
        # Ignore missing Prisma engine checksum errors (necessary on NixOS)
        export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

        echo "🚀 Prisma development environment ready!"
        echo "📦 Node.js: $(node --version)"
        echo "🔒 OpenSSL: Using openssl_1_1 (insecure package allowed)"
        echo "💾 Prisma engines configured and ready"
      '';
    };
  };
}
