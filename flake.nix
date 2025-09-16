{
  description = "Prisma development environment with Qwen3 AI tools";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    nix-ai-tools.url = "github:numtide/nix-ai-tools";
  };

  outputs = {
    nixpkgs,
    nix-ai-tools,
    ...
  }: let
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
        nix-ai-tools.packages.${system}.qwen-code
      ];
      shellHook = ''
        export PKG_CONFIG_PATH=${pkgs.openssl_1_1.dev}/lib/pkgconfig
        export PRISMA_SCHEMA_ENGINE_BINARY=${pkgs.prisma-engines}/bin/schema-engine
        export PRISMA_QUERY_ENGINE_BINARY=${pkgs.prisma-engines}/bin/query-engine
        export PRISMA_QUERY_ENGINE_LIBRARY=${pkgs.prisma-engines}/lib/libquery_engine.node
        export PRISMA_FMT_BINARY=${pkgs.prisma-engines}/bin/prisma-fmt
        export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
        echo "Prisma dev environment and Qwen3 AI tool ready"
      '';
    };
  };
}
