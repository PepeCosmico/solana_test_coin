use borsh::BorshDeserialize;
use solana_program::program_error::ProgramError;

#[derive(BorshDeserialize)]
pub struct Swap {
    pub amount: u32,
}

#[derive(BorshDeserialize)]
pub struct Mint {
    pub amount: u32,
}

pub enum PepoInstruction {
    Swap(Swap),
    Mint(Mint),
}

impl PepoInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (&variant, rest) = input
            .split_first()
            .ok_or(ProgramError::InvalidInstructionData)?;

        Ok(match variant {
            0 => {
                let swap =
                    Swap::try_from_slice(rest).map_err(|_| ProgramError::InvalidInstructionData)?;
                Self::Swap(swap)
            }
            1 => {
                let mint =
                    Mint::try_from_slice(rest).map_err(|_| ProgramError::InvalidInstructionData)?;
                Self::Mint(mint)
            }
            _ => return Err(ProgramError::InvalidInstructionData),
        })
    }
}
