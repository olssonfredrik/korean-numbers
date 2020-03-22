import { Engine } from "@rocketfuel/core/engine";
import { Asserts } from "@rocketfuel/core/util";
import { IVoice } from "./IVoice";

export class KoreanVoice implements IVoice
{
	private readonly prefix: string;
	private readonly engine: Engine;

	/**
	 *
	 */
	public constructor( engine: Engine, name: string )
	{
		this.engine = engine;
		this.prefix = name + "/";
	}

	/**
	 *
	 */
	public SayNumber( x: number, alternative: boolean = false ): number
	{
		const words = new Array< string >();

		if( alternative )
		{
			const small = x % 100;
			const large = x - small;
			if( large > 0 )
			{
				words.push( ...this.CreateSino( large ) );
				words.push( "Misc/200ms" );
			}
			words.push( ...this.CreateNative( small ) );
		}
		else
		{
			words.push( ...this.CreateSino( x ) );
		}

		return this.Say( words );
	}

	/**
	 *
	 */
	public SayDate( year: number, month: number, day: number ): number
	{
		const words = new Array< string >();

		if( year > 0 )
		{
			words.push( ...this.CreateSino( year ) );
			words.push( "Date/Year" );
			words.push( "Misc/400ms" );
		}

		if( month === 6 )
		{
			words.push( "Date/6th_Month" );
		}
		else if( month === 10 )
		{
			words.push( "Date/10th_Month" );
		}
		else
		{
			words.push( ...this.CreateSino( month ) );
			words.push( "Date/Month" );
		}

		words.push( "Misc/400ms" );
		words.push( ...this.CreateSino( day ) );
		words.push( "Date/Day" );

		return this.Say( words );
	}

	/**
	 *
	 */
	public SayTime( hours: number, minutes: number, amPm: boolean = false ): number
	{
		const words = new Array< string >();

		if( amPm )
		{
			words.push( hours > 12 ? "Time/Afternoon" : "Time/Morning" );
			words.push( "Misc/400ms" );
		}

		words.push( ...this.CreateNative( ( hours % 12 ) || 12, true ) );
		words.push( "Time/Hours" );

		if( minutes > 0 )
		{
			words.push( "Misc/400ms" );
			words.push( ...this.CreateSino( minutes ) );
			words.push( "Time/Minutes" );
		}

		return this.Say( words );
	}

	/**
	 *
	 */
	public SayMoney( amount: number ): number
	{
		const words = new Array< string >();

		words.push( ...this.CreateSino( amount ) );
		words.push( "Misc/200ms" );
		words.push( "Money/Won" );

		return this.Say( words );
	}

	/**
	 *
	 */
	public SaySequence( sequence: Array< number >, speed: number ): number
	{
		const words = new Array< string >();
		const delay = ( speed === 0 ) ? "Misc/400ms" : ( ( speed === 1 ) ? "Misc/200ms" : "" );

		sequence.forEach( ( x ) =>
		{
			if( x === 1 || x === 2 )
			{
				words.push( ...this.CreateNative( x ) );
			}
			else
			{
				words.push( ...this.CreateSino( x ) );
			}
			if( delay.length > 0 )
			{
				words.push( delay );
			}
		} );

		return this.Say( words );
	}

	/**
	 *
	 */
	private CreateSino( x: number ): Array< string >
	{
		Asserts.Assert( x >= 0 );
		const prefix = "Sino/";
		const words = new Array< string >();

		if( x === 0 )
		{
			words.push( prefix + "0" );
			return words;
		}
		if( x > 99999 )
		{
			const below10k = ( x % 10000 );
			const above10k = Math.floor( x / 10000 );
			words.push( ...this.CreateSino( above10k ) );
			words.push( prefix + "10000" );
			if( below10k > 0 )
			{
				words.push( ...this.CreateSino( below10k ) );
			}
			return words;
		}

		// handle 0-99 part
		const small = x % 100;
		if( small > 19 )
		{
			words.push( prefix + Math.floor( small / 10 ) );
			words.push( prefix + "1" + ( small % 10 ) );
		}
		else if( small > 0 )
		{
			words.push( prefix + small );
		}

		// handle > 99 part
		let text = "" + Math.floor( x / 100 );
		let offset = 100;
		while( text.length > 0 )
		{
			const character = text[ text.length - 1];
			if( character !== "0" )
			{
				words.unshift( prefix + offset );
				if( character !== "1" )
				{
					words.unshift( prefix + character );
				}
			}
			offset *= 10;
			text = text.substring( 0, text.length - 1 );
		}

		return words;
	}

	/**
	 *
	 */
	private CreateNative( x: number, short: boolean = false ): Array< string >
	{
		Asserts.Assert( x > 0 && x < 100 );
		const prefix = "Native/";
		const small = x % 10;
		const big = x - small;
		const alt = ( short && small >= 1 && small <= 4 ) ? "_alt" : "";
		const words = new Array< string >();

		if( big > 0 )
		{
			words.push( prefix + big );
		}
		if( small > 0 )
		{
			words.push( prefix + small + alt );
		}

		return words;
	}

	/**
	 *
	 */
	private Say( words: Array< string > ): number
	{
		const sounds = words.map( ( word ) => this.prefix + word );
		this.engine.EventManager.Send( { EventId: "Sound:Play", Params: sounds } );
		return words.length * 0.4; // Hack to make a rough estimate of time :(
	}
}
