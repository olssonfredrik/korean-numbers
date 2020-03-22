import { IVoice } from "./IVoice";

export class MuteVoice implements IVoice
{
	public SayNumber( numberToSay: number ): number
	{
		return 0;
	}

	public SayDate( year: number, month: number, day: number ): number
	{
		return 0;
	}

	public SayTime( hours: number, minutes: number ): number
	{
		return 0;
	}

	public SayMoney( amount: number ): number
	{
		return 0;
	}

	public SaySequence( sequence: Array< number >, speed: number ): number
	{
		return 0;
	}
}
