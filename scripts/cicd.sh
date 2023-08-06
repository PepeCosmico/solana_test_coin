#! /bin/bash

SOLANA_PROGRAMS=("pepo_coin")

case $1 in
  "reset")
    rm -rf ./node_modules
    for x in $(solana program show --programs | awk 'RP==0 {print $1}'); do
      if [[ $x != "Program" ]];
      then
        solana program close $x --bypass-warning;
      fi
    done
    for program in "${SOLANA_PROGRAMS[@]}"; do
      cargo clean --manifest-path=./programs/$program/Cargo.toml
    done
    rm -rf target/program
    ;;
  "clean")
    rm -rf ./node_modules
    for program in "${SOLANA_PROGRAMS[@]}"; do
      cargo clean --manifest-path=./programs/$program/Cargo.toml
    done;;
  "build")
    for program in "${SOLANA_PROGRAMS[@]}"; do
      cargo build-bpf --manifest-path=./programs/$program/Cargo.toml --bpf-out-dir=./target/program
    done;;
  "deploy")
    for program in "${SOLANA_PROGRAMS[@]}"; do
      cargo build-bpf --manifest-path=./programs/$program/Cargo.toml --bpf-out-dir=./target/program
      solana program deploy target/program/$program.so
    done;;
  "reset-and-build")
    rm -rf ./node_modules
    for x in $(solana program show --programs | awk 'RP==0 {print $1}'); do 
      if [[ $x != "Program" ]]; 
      then 
        solana program close $x --bypass-warning; 
      fi
    done
    rm -rf target/program
    for program in "${SOLANA_PROGRAMS[@]}"; do
      cargo clean --manifest-path=./programs/$program/Cargo.toml
      cargo build-bpf --manifest-path=./programs/$program/Cargo.toml --bpf-out-dir=./target/program
      solana program deploy target/program/$program.so
    done
    npm install
    solana program show --programs
    ;;
  "listen")
    program_pubkey=$(solana-keygen pubkey ./target/program/${SOLANA_PROGRAMS[0]}-keypair.json);
    solana logs | grep "$program_pubkey invoke" -A 10
    ;;
esac
