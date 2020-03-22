export interface IVoice
{
	SayNumber( x: number, alternative: boolean ): number;
	SayDate( year: number, month: number, day: number ): number;
	SayTime( hours: number, minutes: number ): number;
	SayMoney( amount: number ): number;
	SaySequence( sequence: Array< number >, speed: number ): number;
}
