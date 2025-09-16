{pkgs ? import <nixpkgs> {}}:
pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs
    pkgs.prisma
    pkgs.prisma-engines
    pkgs.openssl_1_1
  ];

  shellHook = ''
    export PKG_CONFIG_PATH=${pkgs.openssl_1_1.dev}/lib/pkgconfig
    export PRISMA_SCHEMA_ENGINE_BINARY=${pkgs.prisma-engines}/bin/schema-engine
    export PRISMA_QUERY_ENGINE_BINARY=${pkgs.prisma-engines}/bin/query-engine
    export PRISMA_QUERY_ENGINE_LIBRARY=${pkgs.prisma-engines}/lib/libquery_engine.node
    export PRISMA_FMT_BINARY=${pkgs.prisma-engines}/bin/prisma-fmt

    # Ignore missing Prisma engine checksum errors (necessary on NixOS)
    export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
  '';
}
