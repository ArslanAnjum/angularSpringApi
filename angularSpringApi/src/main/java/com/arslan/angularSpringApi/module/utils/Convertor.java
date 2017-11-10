package com.arslan.angularSpringApi.module.utils;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

@Service("convertor")
public class Convertor {

	public String toString(String input){
		return input.toString();
	}
	
	public Integer toInteger(String input){
		Integer x = null;
		try{
			x = Integer.parseInt(input);
		}catch (Exception e){
			System.out.println(e.getMessage());
		}
		return x;
	}

	public ArrayList<Integer> toIntegerArray(String input){
		ArrayList<Integer> lst = new ArrayList<>();
		try{
			Integer x = null;
			x = Integer.parseInt(input);
			lst.add(x);
		}catch (Exception e){
			System.out.println(e.getMessage());
		}
		
		if (lst.size()>0)
			return lst;
		else
			return null;
	}
	
	public Boolean toBool(String input){
		Boolean b=null;
		try{
			b=Boolean.parseBoolean(input);
		}catch(Exception e){
			System.out.println(e.getMessage());
		}
		return b;
	}
	
	public Boolean filterCollection(Object obj){
		System.out.println(obj);
		return true;
	}
}
