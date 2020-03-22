import { Random } from "@rocketfuel/core/util";

export class NumberGeneratorFunctions
{
	/**
	 *
	 */
	public static RandomizeNumberSino( difficulty: number ): Array< { Name: string, Value: number } >
	{
		let x = 0;
		switch( difficulty )
		{
			case 0:
				x = Random.IntRange( 0, 10 );
				break;

			case 1:
				x = Random.IntRange( 1, 100 );
				break;

			case 2:
				x = Random.IntRange( 1, 1000 );
				break;
		}

		return [ { Name: "Game:NumberSino", Value: x } ];
	}

	/**
	 *
	 */
	public static RandomizeNumberNative( difficulty: number ): Array< { Name: string, Value: number } >
	{
		let x = 0;
		switch( difficulty )
		{
			case 0:
				x = Random.IntRange( 1, 10 );
				break;

			case 1:
				x = ( Random.GetBoolean() ? Random.IntRange( 1, 10 ) : 10 * Random.IntRange( 1, 9 ) );
				break;

			case 2:
				x = Random.IntRange( 1, 99 );
				break;
		}

		return [ { Name: "Game:NumberNative", Value: x } ];
	}

	/**
	 *
	 */
	public static RandomizeTime( difficulty: number ): Array< { Name: string, Value: number } >
	{
		const hours = Random.IntRange( 1, 12 );
		let minutes = 0;
		if( difficulty === 1 )
		{
			minutes = 10 * Random.IntRange( 0, 5 );
		}
		else if( difficulty === 2 )
		{
			minutes = Random.IntRange( 0, 59 );
		}

		return [ { Name: "Game:TimeHours", Value: hours }, { Name: "Game:TimeMinutes", Value: minutes } ];
	}

	/**
	 *
	 */
	public static RandomizeDate( difficulty: number ): Array< { Name: string, Value: number } >
	{
		const year = ( difficulty > 1 ) ? 1980 + Random.IntRange( 0, 50 ) : 2000;
		const month = Random.IntRange( 1, 12 );
		const day = ( difficulty > 0 ) ? Random.IntRange( 1, new Date( year, month, 0 ).getDate() ) : 1;

		return [ { Name: "Game:DateYear", Value: year }, { Name: "Game:DateMonth", Value: month }, { Name: "Game:DateDay", Value: day } ];
	}

	/**
	 *
	 */
	public static RandomizeMoney( difficulty: number ): Array< { Name: string, Value: number } >
	{
		let money = 0;
		switch( difficulty )
		{
			case 0:
				money = Random.IntRange( 1, 10 ) * Random.FromArray( [ 100, 1000, 10000 ] );
				break;

			case 1:
				money = ( 1 + 2 * Random.IntRange( 0, 9 ) ) * Random.FromArray( [ 500, 5000, 50000 ] );
				break;

			case 2:
				money = Random.IntRange( 0, 9 ) * 100000;
				money += Random.IntRange( 0, 9 ) * 10000;
				money += Random.IntRange( 0, 9 ) * 1000;
				money += Random.IntRange( 0, 9 ) * 100;
				break;
		}

		return [ { Name: "Game:Money", Value: money } ];
	}

	/**
	 *
	 */
	public static RandomizeSequence( difficulty: number ): Array< { Name: string, Value: number } >
	{
		const data = [];
		for( let i = 0; i < 4; i++ )
		{
			data.push( { Name: "Game:Sequence" + i, Value: Random.IntRange( 0, 9 ) } );
		}

		return data;
	}
}
