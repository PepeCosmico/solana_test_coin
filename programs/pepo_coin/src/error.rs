use num_derive::FromPrimitive;
use solana_program::{
    decode_error::DecodeError,
    msg,
    program_error::{PrintProgramError, ProgramError},
};
use thiserror::Error;

#[derive(Clone, Debug, Eq, Error, PartialEq, FromPrimitive)]
pub enum SwapError {
    #[error("TODO")]
    TODO,
    #[error("Input account owner is not the program address")]
    InvalidOwner,
}

impl From<SwapError> for ProgramError {
    fn from(e: SwapError) -> Self {
        ProgramError::Custom(e as u32)
    }
}

impl<T> DecodeError<T> for SwapError {
    fn type_of() -> &'static str {
        "Swap Error"
    }
}

impl PrintProgramError for SwapError {
    fn print<E>(&self)
    where
        E: 'static
            + std::error::Error
            + DecodeError<E>
            + PrintProgramError
            + num_traits::FromPrimitive,
    {
        match self {
            SwapError::TODO => msg!("Error: TODO"),
            SwapError::InvalidOwner => {
                msg!("Error: Input account owner is not the program address")
            }
        };
    }
}
