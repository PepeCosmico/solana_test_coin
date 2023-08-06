use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    program::invoke,
    pubkey::Pubkey,
};
use spl_token::instruction as token_instruction;

use crate::instruction::{Mint, PepoInstruction, Swap};

pub struct Processor;

impl Processor {
    pub fn process(
        _program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        let instruction = PepoInstruction::unpack(instruction_data)?;

        match instruction {
            PepoInstruction::Swap(swap_data) => swap(accounts, swap_data)?,
            PepoInstruction::Mint(mint_data) => mint(accounts, mint_data)?,
        };
        Ok(())
    }
}

fn swap(accounts: &[AccountInfo], swap: Swap) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let token_program = next_account_info(accounts_iter)?;
    let source = next_account_info(accounts_iter)?;
    let destination = next_account_info(accounts_iter)?;
    let owner = next_account_info(accounts_iter)?;

    msg!("Token: {}", token_program.key);
    msg!(
        "Transfering an amount of {} tokens from {} to {}",
        swap.amount,
        owner.key,
        destination.key
    );

    invoke(
        &token_instruction::transfer(
            &token_program.key,
            &source.key,
            &destination.key,
            &owner.key,
            &[&owner.key],
            swap.amount as u64,
        )?,
        &[
            token_program.clone(),
            source.clone(),
            destination.clone(),
            owner.clone(),
        ],
    )?;

    msg!("Transaction successfull!");

    Ok(())
}

fn mint(accounts: &[AccountInfo], mint: Mint) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();

    let mint_authority = next_account_info(accounts_iter)?;
    let token_mint = next_account_info(accounts_iter)?;
    let token_account = next_account_info(accounts_iter)?;
    let rent = next_account_info(accounts_iter)?;
    let token_program = next_account_info(accounts_iter)?;

    msg!(
        "Minting {} to token id: {} with minting account: {}",
        mint.amount,
        token_program.key,
        token_mint.key
    );

    invoke(
        &token_instruction::mint_to(
            &token_program.key,
            &token_mint.key,
            &token_account.key,
            &mint_authority.key,
            &[&mint_authority.key],
            mint.amount as u64,
        )?,
        &[
            token_mint.clone(),
            mint_authority.clone(),
            token_account.clone(),
            token_program.clone(),
            rent.clone(),
        ],
    )?;

    msg!("Minting successfull!");

    Ok(())
}
